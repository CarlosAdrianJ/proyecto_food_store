package com.foodstore.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI foodStoreOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Food Store API")
                        .version("1.0.0")
                        .description("API REST del proyecto Food Store")
                        .contact(new Contact()
                                .name("Food Store Team")
                                .email("admin@foodstore.com")));
    }
}