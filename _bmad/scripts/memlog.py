#!/usr/bin/env python3
# /// script
# requires-python = ">=3.8"
# ///
"""memlog — an append-only memory log: LLM-optimal working memory for a skill.

A memlog is the dense, chronological record of everything that mattered in a piece of
work — every item the user generated or accepted — kept minimal like human memory: only
what's important, never bloated. It persists ACROSS sessions, so a fresh session can
load it and continue. It is NOT a deliverable; downstream artifacts (a brief, a PRD, a
deck, a report) are *derived* from it on demand. The host skill supplies the vocabulary
by how it calls `append` — the tool stays neutral.

It is a FLAT log: there are no sections or grouping. Every entry is one line, recorded
at the END in the order it happened. The chronology itself is the structure — an event
like "started technique X" is just another entry, same as an idea or an insight.

Three invariants make it trustworthy:

  1. Append-only, chronological. Entries land at the end, in the order they happen.
     Nothing is ever inserted backward, reordered, edited, or removed. There is no
     edit or delete subcommand by design; history is never rewritten.
  2. Write-only / blind. Every command is an atomic, context-free write and echoes the
     new state as one line of JSON, so the caller never re-reads the file mid-session.
     The one time the file is read is on resume — and the caller reads it itself, not
     via this script.
  3. No lifecycle status. A memory log has no "complete" flag. Whether the work is done,
     blocked, or paused is itself a fact that happened, so it is recorded as an entry
     (e.g. `append --type event --text "session complete"`), never as frontmatter the
     log would have to mutate. The chronology stays the single source of truth, and a
     resume learns the state by reading the last entries — the same way it learns
     everything else.

Atomicity: every write goes to a temp file, is flushed and fsync'd, then atomically
renamed over the target, so a crash never leaves a half-written entry.

The file shape (.memlog.md):

    ---
    topic: Onboarding flow for a budgeting app
    goal: lift week-1 retention
    updated: 2026-06-07T14:22
    ---

    - (note) user picked techniques: SCAMPER, then Six Thinking Hats
    - (technique) started SCAMPER
    - (idea) skip the signup wall: let people try with sample data first
    - (idea) auto-import one bank account so the first screen shows real numbers
    - (question) is open-banking consent too heavy for step one?
    - (insight) the "scary numbers" risk and the "real numbers" idea are one lever: show real data, pre-categorized
    - (direction) optimize for the anxious first-timer, not the power user
    - (decision) lead with one pre-categorized account; defer multi-account import
    - (event) session complete

Each entry may carry an optional `--type` — what KIND it is (idea, insight, question,
decision, direction, assumption, gap, note, event, …) — and an optional `--by` naming
who it came from (e.g. `user`, `coach`), for sessions where authorship matters. Both
render into one short inline tag: `(idea)`, `(idea by user)`, `(by coach)`. Omit them
for a plain note. The host skill names the vocabulary; the script does not enforce one.

Commands:
  init   (--workspace DIR | --path FILE) [--field k=v ...]    create the memlog (errors if it exists)
  append (--workspace DIR | --path FILE) --text STR [--type T] [--by W]  append one entry at the end
  set    (--workspace DIR | --path FILE) --key K --value V    set/replace a descriptive frontmatter field

Addressing: `--workspace` is the run folder, and the memlog is always {workspace}/.memlog.md.
`--path` points straight at the memlog file instead, for callers that already hold the path.
"""
from __future__ import annotations  # keep type-hint syntax lazy so the script runs on 3.8+

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

MEMLOG = ".memlog.md"


def now() -> str:
    """
    Return the current local date and time formatted as `YYYY-MM-DDTHH:MM`.
    
    Returns:
    	str: The current local timestamp.
    """
    return datetime.now().strftime("%Y-%m-%dT%H:%M")


def resolve(args) -> Path:
    """
    Resolve the memory log path from an explicit path or workspace directory.
    
    Parameters:
    	args: Command-line arguments containing either `path` or `workspace`.
    
    Returns:
    	Path: The resolved memory log path.
    """
    return Path(args.path) if args.path else Path(args.workspace) / MEMLOG


def split(text: str) -> tuple[dict, str]:
    """
    Parse frontmatter metadata and the body from a memory log.
    
    Parameters:
        text (str): Memory log content with `---`-delimited frontmatter.
    
    Returns:
        tuple[dict, str]: The frontmatter fields and the log body.
    
    Raises:
        ValueError: If frontmatter is missing or not terminated.
    """
    lines = text.splitlines()
    if not lines or lines[0] != "---":
        raise ValueError(".memlog.md has no frontmatter")
    end = next((i for i in range(1, len(lines)) if lines[i] == "---"), None)
    if end is None:
        raise ValueError(".memlog.md frontmatter is not terminated")
    meta: dict[str, str] = {}
    for line in lines[1:end]:
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    return meta, "\n".join(lines[end + 1:]).lstrip("\n")


def render(meta: dict, body: str) -> str:
    # Neutralize newlines in values so a multi-line field can't break the fence on re-read.
    """Serialize metadata and body as a Markdown document with frontmatter.
    
    Parameters:
        meta (dict): Frontmatter fields and their values.
        body (str): Markdown content following the frontmatter.
    
    Returns:
        str: The serialized document with newline characters in metadata values replaced by spaces.
    """
    fm = "\n".join(f"{k}: {' '.join(str(v).splitlines())}" for k, v in meta.items())
    return "---\n" + fm + "\n---\n\n" + body.rstrip("\n") + "\n"


def read_memlog(path: Path) -> tuple[dict, str]:
    """Read and parse an existing memory log, or exit with code 2 on failure.

    Mirrors cmd_init's error handling: a missing or malformed log is a
    user-facing error, not a traceback.
    """
    try:
        raw = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        print(f"error: memory log not found at {path} — run 'init' first", file=sys.stderr)
        sys.exit(2)
    except OSError as exc:
        print(f"error: cannot read memory log at {path}: {exc}", file=sys.stderr)
        sys.exit(2)
    try:
        return split(raw)
    except ValueError as exc:
        print(f"error: malformed memory log at {path}: {exc}", file=sys.stderr)
        sys.exit(2)


def touch(meta: dict) -> None:
    """Stamp `updated` and keep it last so the field order stays predictable."""
    meta.pop("updated", None)
    meta["updated"] = now()


def write_atomic(path: Path, text: str) -> None:
    """
    Write text to a file by atomically replacing its existing contents.
    
    Parameters:
        path (Path): Destination file path.
        text (str): Content to write.
    """
    tmp = path.with_suffix(path.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)


def entry_count(body: str) -> int:
    """Count body lines that begin with "- ".
    
    Parameters:
    	body (str): The log body to inspect.
    
    Returns:
    	int: The number of entry lines.
    """
    return sum(1 for ln in body.splitlines() if ln.startswith("- "))


def ack(path: Path, body: str) -> None:
    """Print a JSON acknowledgment containing the log path and entry count."""
    print(json.dumps({
        "ok": True,
        "memlog": str(path),
        "entries": entry_count(body),
    }))


def cmd_init(args) -> int:
    """
    Create a new memory log with the specified frontmatter fields.
    
    Parameters:
    	args: Command-line arguments containing the target location and optional `key=value` fields.
    
    Returns:
    	int: `0` if the log is created successfully, `2` if the target exists or a field is malformed.
    """
    path = resolve(args)
    if path.exists():
        print(f"error: {path} already exists; use append/set to update it", file=sys.stderr)
        return 2
    path.parent.mkdir(parents=True, exist_ok=True)
    meta: dict[str, str] = {}
    for pair in args.field or []:
        if "=" not in pair:
            print(f"error: --field expects key=value, got {pair!r}", file=sys.stderr)
            return 2
        k, v = pair.split("=", 1)
        meta[k.strip()] = v.strip()
    touch(meta)
    write_atomic(path, render(meta, ""))
    ack(path, "")
    return 0


def cmd_append(args) -> int:
    """
    Append a one-line entry to an existing memory log.
    
    Parameters:
    	args: Command-line arguments containing the log target, entry text, and optional type or attribution.
    
    Returns:
    	0 after the entry is written and acknowledged.
    """
    path = resolve(args)
    meta, body = read_memlog(path)
    text = " ".join(args.text.split())  # collapse newlines/runs → one-line entry, no prose bloat
    label = args.type or ""
    if args.by:
        label = f"{label} by {args.by}".strip()  # attribution: "(idea by user)" / "(by coach)"
    tag = f"({label}) " if label else ""
    entry = f"- {tag}{text}"
    body = (body.rstrip("\n") + "\n" + entry) if body.strip() else entry  # always at the end
    touch(meta)
    write_atomic(path, render(meta, body))
    ack(path, body)
    return 0


def cmd_set(args) -> int:
    """Set a frontmatter field in an existing memory log.
    
    Parameters:
    	args: Command-line arguments containing the log target, field name, and value.
    
    Returns:
    	int: `0` after the field is updated and the log is acknowledged.
    """
    path = resolve(args)
    meta, body = read_memlog(path)
    meta[args.key] = args.value
    touch(meta)
    write_atomic(path, render(meta, body))
    ack(path, body)
    return 0


def add_target(sp) -> None:
    """Add mutually exclusive options for selecting a workspace or explicit memlog path."""
    g = sp.add_mutually_exclusive_group(required=True)
    g.add_argument("--workspace", help="run folder; the memlog is {workspace}/.memlog.md")
    g.add_argument("--path", help="explicit memlog file path (alternative to --workspace)")


def main(argv: list[str] | None = None) -> int:
    """
    Run the memlog command-line interface and dispatch the selected subcommand.
    
    Parameters:
    	argv (list[str] | None): Command-line arguments to parse, or `None` to use the process arguments.
    
    Returns:
    	int: `0` for a successful command, `2` when command execution reports an error.
    """
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    pi = sub.add_parser("init", help="create the memlog")
    add_target(pi)
    pi.add_argument("--field", action="append", metavar="KEY=VALUE", help="frontmatter field (repeatable)")
    pi.set_defaults(func=cmd_init)

    pa = sub.add_parser("append", help="append one entry at the end")
    add_target(pa)
    pa.add_argument("--text", required=True)
    pa.add_argument("--type", help="entry kind, rendered as an inline tag")
    pa.add_argument("--by", help="who the entry came from (e.g. user, coach); rendered into the tag")
    pa.set_defaults(func=cmd_append)

    pset = sub.add_parser("set", help="set a descriptive frontmatter field")
    add_target(pset)
    pset.add_argument("--key", required=True)
    pset.add_argument("--value", required=True)
    pset.set_defaults(func=cmd_set)

    args = p.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
