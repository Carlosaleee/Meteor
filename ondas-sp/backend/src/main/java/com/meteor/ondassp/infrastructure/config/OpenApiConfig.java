package com.meteor.ondassp.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ondas SP API")
                        .description("API de previsão do tempo e ondas para Ilha Comprida/SP")
                        .version("0.1.0")
                        .contact(new Contact()
                                .name("Meteor Ondas SP")
                                .email("contato@ondas-sp.com")
                                .url("https://github.com/meteor/ondas-sp"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Desenvolvimento"),
                        new Server().url("https://api.ondas-sp.com").description("Produção")));
    }
}
