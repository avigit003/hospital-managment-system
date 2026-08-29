@echo off
title CareSync HMS - Java JDBC Backend (Port 8080)
echo ========================================================
echo  Starting CareSync Hospital Backend (Spring Boot + JDBC)
echo ========================================================
cd /d "%~dp0backend"
"C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" spring-boot:run
pause
