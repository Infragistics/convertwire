# Error Logs

Logs are generated as `csv` files with the following schema:

- *message*: free form text message
- *context*: any context objects (serialized)
- *tag*: useful for categorization
- *date/time stamp*: so you can see when messages are logged

## Example Log

This is an example of a log file:

```
file-name1.html does not exist, {"name":"file-name1.html"},missing-file,2015-09-02T15:13:15-07:00
```