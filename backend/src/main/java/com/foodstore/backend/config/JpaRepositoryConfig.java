package com.foodstore.backend.config;

import com.foodstore.backend.repository.BaseRepositoryImpl;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.foodstore.backend.repository",
        repositoryBaseClass = BaseRepositoryImpl.class
)
public class JpaRepositoryConfig {
}