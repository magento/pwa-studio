#!/bin/sh

# This simple script assumes that the server will stay in the foreground, that
# it will echo its full host (e.g. http://localhost:8919) to stdout (with a
# line feed to trigger consumption of the URL) as part of its initial logging,
# and that it will gracefully exit on receiving SIGTERM, which are good #
# habits for a web server to have anyway.

# The `exec` ensures that the server process will receive signals sent to this
# script, such as SIGTERM, which the test harness uses to gracefully close.

# The `grep` ensures that if more than just a URL is echoed to standard output,
# the URL be parsed out of it.

exec ./path_to_upward_server/bin/upward --config "$UPWARD_PATH" | grep -ioE '\bhttps?://[a-z0-9][a-z0-9-\.]*\n'
