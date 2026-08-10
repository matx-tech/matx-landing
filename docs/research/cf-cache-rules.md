# matx.ee cloudflare 

## caching

### cache rules

[Cache Rules](https://dash.cloudflare.com/c1cf23b37f7f32828f44df16938a0d2d/matx.ee/caching/rules)

New Cache Rule

[Cache Rules](https://dash.cloudflare.com/c1cf23b37f7f32828f44df16938a0d2d/matx.ee/caching/rules)

New Cache Rule

Ask AI[Support](https://dash.cloudflare.com/?to=/:account/support)

# New Cache RuleSpecify which resources should be cached and for how long.

### Cache everything

Adjust the cache level for all requests.

[Create from template](https://dash.cloudflare.com/c1cf23b37f7f32828f44df16938a0d2d/matx.ee/caching/rules/cache/new?template=cache-everything)

[Cache Rules](https://dash.cloudflare.com/c1cf23b37f7f32828f44df16938a0d2d/matx.ee/caching/rules/cache)

### Bypass cache for everything

Bypass cache for all requests

[Create from template](https://dash.cloudflare.com/c1cf23b37f7f32828f44df16938a0d2d/matx.ee/caching/rules/cache/new?template=bypass-cache-everything)

[Cache Rules](https://dash.cloudflare.com/c1cf23b37f7f32828f44df16938a0d2d/matx.ee/caching/rules/cache)

### Cache default file extensions

Replicate Page Rules caching behaviour by making only default extensions eligible for cache.

[Create from template](https://dash.cloudflare.com/c1cf23b37f7f32828f44df16938a0d2d/matx.ee/caching/rules/cache/new?template=cache-file-extensions)

[Cache Rules](https://dash.cloudflare.com/c1cf23b37f7f32828f44df16938a0d2d/matx.ee/caching/rules/cache)

Rule name (required)

Give your rule a descriptive name.

If incoming requests match…

Custom filter expression

Only apply the rule to requests matching the custom filter expression

All incoming requests

Apply the rule to all requests

When incoming requests match…

Field

URI Full

Operator

wildcard

Value

e.g. https://\*.example.com/files/\*

AndOr

AndOr

Expression Preview

Edit expression

(http.request.full\_uri wildcard r"")

36 / 4000 characters

Then...

# Cache eligibility

(Required)

Mark whether the request’s response from origin is eligible for caching. Caching itself will still depend on the cache-control header and your other caching configurations. [Learn more](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/#cache-eligibility)

Bypass cache

Eligible for cache

# Edge TTL

(Optional)

Add setting

Specify if and how long Cloudflare should cache the response, depending on if a cache-control header is present on the origin response. If you need to modify your origin’s cache-control directives, create a cache response transform rule. Learn more about [cache rules](https://developers.cloudflare.com/cache/how-to/cache-rules/) or [cache response transforms](https://developers.cloudflare.com/rules/transform/response-header-modification/)

Use cache-control header if present, bypass cache if not

Use cache-control header if present, cache request with Cloudflare's default TTL for the response status if not

Ignore cache-control header and use this TTL

Input time-to-live (TTL)

# 

Status code TTL

Specify how long Cloudflare should cache the response based on the status code from the origin.

Add status code setting

# Browser TTL

(Optional)

Add setting

Specify how long client browsers should cache the response. Cloudflare cache purge will not purge content cached on client browsers, so high browser TTLs may lead to stale content. [Learn more](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/#browser-ttl)

Bypass cache

Respect origin TTL

Override origin and use this TTL

Input time-to-live (TTL)

# Cache key

(Optional)

Add setting

Define which components of the request are included or excluded from the cache key Cloudflare uses to store the response in cache. [Learn more](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/#cache-key)

# Cache deception armor

Protect from web cache deception attacks while allowing static assets to be cached

Changing the below settings will modify the cache key, effectively purging cache for matching URLs

# Cache by device type

Separate cached content based on the visitor’s device type

# Ignore query string

Deliver the same resource to everyone independent of the query string

# Sort query string

Treat requests with the same query parameters the same, regardless of the order those query parameters are in.

**Query string** (optional)

All query string parameters

All query string parameters except:

Enter a parameter value

No query parameters except:

Enter a parameter value

Ignore query string

**Headers** (optional)

Define which headers will go into the Cache Key. [Learn more.](https://developers.cloudflare.com/cache/how-to/cache-keys/#headers)

Include headers and selected values

Match on all values in header, include only matched values in the cache key. For [restricted](https://developers.cloudflare.com/cache/how-to/cache-keys/#headers:~:text=accept,user%2Dagent) headers you need to include from 1 to 10 values.

Leave blank for all values

Add header

Check presence of

Enter header names

Include origin header

**Cookie** (optional)

Include these cookie names and their values

Enter cookie names

Check presence of

Enter cookie names

**Host** (optional)

Use original host

Resolved host

**User** (optional)

Device type

Country

Language

# Vary

(Optional)

Add setting

Determine how Cloudflare segments responses based on the Vary header. [Learn more](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/#vary)

Normalize values(Recommended)Normalize values for each request header listed in the response's Vary header before determining the variance key. Recommended to maximize cache hits.

Use raw header valuesValues of the request headers listed in the response's Vary header are used without modification when determining the variance key.

Bypass cachingSkip caching when the request has a header listed in the response's Vary header, but does not have a specific configuration (below).

# Per header configuration

Determine whether we normalize, use raw value, or bypass cache for specific request headers.

No specific request headers configured. The default behavior applies to every request header listed in the Vary response header.

Add request header

# Cache Reserve eligibility

(Optional)

Add setting

Mark whether the request's response from origin is eligible for Cache Reserve (requires a Cache Reserve [add-on plan](https://dash.cloudflare.com/c1cf23b37f7f32828f44df16938a0d2d/matx.ee/caching/cache-reserve) ).

Bypass Cache Reserve

Eligible for Cache Reserve

Select minimum file size

# Serve stale content while revalidating

(Optional)

Add setting

Define if Cloudflare should serve stale content while getting the latest content from the origin. [Learn more](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/#serve-stale-content-while-revalidating)

# Do not serve stale content while updating

If on, Cloudflare will **not** serve stale content while getting the latest content from the origin.

# Respect strong ETags

(Optional)

Add setting

Specify whether or not Cloudflare should respect strong ETag (entity tag) headers. [Learn more](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/#respect-strong-etags)

# Use strong ETag headers

When off, Cloudflare converts strong ETag headers to weak ETag headers.

# Origin error page pass-through

(Optional)

Add setting

Define if Cloudflare should use error pages issued by the origin server in case of HTTP error status codes. [Learn more](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/#origin-error-page-pass-through)

# Use Origin error page pass-thru

When enabled, HTTP error pages will be issued from the origin server instead of Cloudflare.
