#!/bin/sh

# This simple script assumes that the server will stay in the foreground, that
# it will echo its full host (e.g. http://localhost:8919) to stdout (with a
# line feed to trigger consumption of the URL) as part of its initial logging,
# and that it will gracefully exit on receiving SIGTERM, which are good #
# habits for a web server to have anyway.

./path_to_upward_server/bin/upward --config "$UPWARD_PATH" | grep -ioE '\bhttps?://[a-z0-9][a-z0-9-\.]*\n'
