# Generating UUIDs in Java

To generate a UUID in java, begin by importing `java.util.UUID`, which should be built in.

Then, you can generate it by taking:

```java
UUID uuid = UUID.randomUUID();
uuid.toString(); // This gets the actual thing as a string
```