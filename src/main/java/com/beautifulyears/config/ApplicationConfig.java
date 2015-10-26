package com.beautifulyears.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.beautifulyears.repository.DiscussRepository;
import com.mongodb.MongoClient;
import com.mongodb.WriteConcern;

@Configuration
@ComponentScan("com.beautifulyears")
@EnableMongoRepositories(basePackageClasses = {DiscussRepository.class})
public class ApplicationConfig {

    @Bean
    public MongoTemplate mongoTemplate() throws Exception {
    	MongoClient mongo = new MongoClient("localhost", 27017);
        //UserCredentials userCredentials = new UserCredentials("demo", "demo");
        String databaseName = "demo1";
        MongoDbFactory mongoDbFactory = new SimpleMongoDbFactory(mongo, databaseName);// userCredentials);
        MongoTemplate mongoTemplate = new MongoTemplate(mongoDbFactory);
        mongoTemplate.setWriteConcern(WriteConcern.SAFE);
        return mongoTemplate;
    }

}
