FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY back/pom.xml .
COPY back/.mvn .mvn
COPY back/mvnw .
RUN ./mvnw dependency:go-offline -B

COPY back/src src
RUN ./mvnw package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S conpedales && adduser -S conpedales -G conpedales
USER conpedales

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]