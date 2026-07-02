FROM eclipse-temurin:21-jdk-jammy AS build
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY ondas-sp/backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY ondas-sp/backend/src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-jammy
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
