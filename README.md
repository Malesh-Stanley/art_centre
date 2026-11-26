# art_centre

A landing page for notos art center

## Contact form setup

The contact form submits to `contact.php`. Upload the site to a PHP-enabled
hosting account, then set `$contactMailbox` and `$senderMailbox` near the top
of `contact.php` to the mailbox created in cPanel. Use the same mailbox for
both values so the message comes from your domain; visitors' addresses are
included as `Reply-To` so you can reply directly.

The script uses PHP's `mail()` function, which cPanel hosting must have enabled
and configured. Test delivery after deployment and check the hosting account's
mail delivery logs or spam folder if a message does not arrive. Serve the site
over HTTPS. The contact form will not send from static hosting or a local
file preview because it requires PHP on the server.
