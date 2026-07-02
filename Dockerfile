FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY ondas-sp/backend/pom.xml .
COPY ondas-sp/backend/.mvn .mvn
COPY ondas-sp/backend/mvnw .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B
COPY ondas-sp/backend/src ./src
RUN ./mvnw clean package -DskipTests -B

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
