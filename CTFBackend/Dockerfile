FROM gradle:8.14-jdk21-alpine AS build
WORKDIR /app

COPY gradlew .
COPY gradle gradle/
COPY build.gradle .
COPY settings.gradle .

RUN ./gradlew dependencies --no-daemon || true
COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
RUN mkdir -p /app/config

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.config.location=classpath:/,file:/app/config/"]