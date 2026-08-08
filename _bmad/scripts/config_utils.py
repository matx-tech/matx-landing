"""Shared strict TOML loading and structural merge support."""

from __future__ import annotations

import tomllib
from pathlib import Path
from typing import Any, Iterable


class ConfigError(ValueError):
    """Raised when a present configuration layer cannot be used safely."""


_KEYED_MERGE_FIELDS = ("code", "id")


def load_toml(path: Path, *, required: bool = False) -> dict[str, Any]:
    """Load a TOML table, allowing absence only for optional layers."""
    if not path.exists():
        if required:
            raise ConfigError(f"required TOML file not found: {path}")
        return {}
    if not path.is_file():
        raise ConfigError(f"TOML layer is not a file: {path}")
    try:
        with path.open("rb") as stream:
            parsed = tomllib.load(stream)
    except tomllib.TOMLDecodeError as error:
        raise ConfigError(f"failed to parse {path}: {error}") from error
    except OSError as error:
        raise ConfigError(f"failed to read {path}: {error}") from error
    if not isinstance(parsed, dict):
        raise ConfigError(f"TOML layer did not parse to a table: {path}")
    return parsed


def _detect_keyed_merge_field(items: list[Any]) -> str | None:
    """
    Identify the field used to merge an array of dictionaries by key.
    
    Parameters:
        items (list[Any]): Array items to inspect.
    
    Returns:
        str | None: The identifier field name, or `None` when the items are not keyed dictionaries.
    
    Raises:
        ConfigError: If a candidate identifier is not a string or is empty.
    """
    if not items or not all(isinstance(item, dict) for item in items):
        return None
    for candidate in _KEYED_MERGE_FIELDS:
        if all(candidate in item for item in items):
            for item in items:
                value = item[candidate]
                if not isinstance(value, str):
                    raise ConfigError(
                        f"keyed array identifier `{candidate}` must be a string, "
                        f"got {type(value).__name__}"
                    )
                if not value:
                    raise ConfigError(
                        f"keyed array identifier `{candidate}` must not be empty"
                    )
            return candidate
    return None


def _merge_arrays(base: list[Any], override: list[Any]) -> list[Any]:
    """
    Merge configuration arrays by keyed identity or append their items.
    
    Parameters:
    	base (list[Any]): The existing array.
    	override (list[Any]): The overriding array.
    
    Returns:
    	list[Any]: The merged array, with matching keyed entries replaced and new entries appended; unkeyed arrays are concatenated.
    """
    keyed_field = _detect_keyed_merge_field(base + override)
    if keyed_field is None:
        return list(base) + list(override)

    result: list[Any] = []
    index_by_key: dict[str, int] = {}
    for item in base:
        copied = dict(item)
        index_by_key[copied[keyed_field]] = len(result)
        result.append(copied)
    for item in override:
        copied = dict(item)
        key = copied[keyed_field]
        if key in index_by_key:
            result[index_by_key[key]] = copied
        else:
            index_by_key[key] = len(result)
            result.append(copied)
    return result


def structural_merge(base: Any, override: Any) -> Any:
    """
    Merge configuration values recursively.
    
    Parameters:
        base (Any): The original configuration value.
        override (Any): The value whose settings take precedence.
    
    Returns:
        Any: The merged value, with dictionaries merged recursively, keyed
            dictionary arrays combined by identifier, unkeyed arrays appended,
            and other values replaced by the override.
    """
    if isinstance(base, dict) and isinstance(override, dict):
        result = dict(base)
        for key, value in override.items():
            result[key] = structural_merge(result[key], value) if key in result else value
        return result
    if isinstance(base, list) and isinstance(override, list):
        return _merge_arrays(base, override)
    return override


def merge_layers(layers: Iterable[dict[str, Any]]) -> dict[str, Any]:
    """
    Merge configuration layers in order, with later layers taking precedence.
    
    Parameters:
    	layers (Iterable[dict[str, Any]]): Configuration dictionaries ordered from lowest to highest precedence.
    
    Returns:
    	dict[str, Any]: The combined configuration.
    """
    merged: dict[str, Any] = {}
    for layer in layers:
        merged = structural_merge(merged, layer)
    return merged


def load_central_config(project_root: Path) -> dict[str, Any]:
    """
    Load the central BMAD configuration and apply available override layers.
    
    Parameters:
    	project_root (Path): Project root containing the `_bmad` configuration directory.
    
    Returns:
    	dict[str, Any]: The merged configuration, with later layers taking precedence.
    """
    bmad_dir = project_root / "_bmad"
    return merge_layers(
        (
            load_toml(bmad_dir / "config.toml", required=True),
            load_toml(bmad_dir / "config.user.toml"),
            load_toml(bmad_dir / "custom" / "config.toml"),
            load_toml(bmad_dir / "custom" / "config.user.toml"),
        )
    )


def load_customization(project_root: Path | None, skill_dir: Path) -> dict[str, Any]:
    """
    Load skill customization settings with project-level overrides.
    
    Parameters:
        project_root (Path | None): Project root used to locate optional customization overrides.
        skill_dir (Path): Directory containing the required skill customization file.
    
    Returns:
        dict[str, Any]: Merged customization settings, with user overrides taking precedence.
    """
    skill_name = skill_dir.name
    custom_dir = project_root / "_bmad" / "custom" if project_root else None
    return merge_layers(
        (
            load_toml(skill_dir / "customize.toml", required=True),
            load_toml(custom_dir / f"{skill_name}.toml") if custom_dir else {},
            load_toml(custom_dir / f"{skill_name}.user.toml") if custom_dir else {},
        )
    )
