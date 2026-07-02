@REM Maven Wrapper - https://maven.apache.org/wrapper/
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir

@echo off
setlocal

set "MAVEN_PROJECTBASEDIR=%~dp0"

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"

if exist "%WRAPPER_JAR%" (
    java %MAVEN_OPTS% ^
        -classpath "%WRAPPER_JAR%" ^
        "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
        org.apache.maven.wrapper.MavenWrapperMain %*
) else (
    echo Error: %WRAPPER_JAR% not found
    exit /b 1
)

endlocal
