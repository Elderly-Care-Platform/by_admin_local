package com.beautifulyears.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.beautifulyears.repository.DiscussRepository;
import com.mongodb.Mongo;
import com.mongodb.WriteConcern;

@Configuration
@ComponentScan
@EnableMongoRepositories(basePackageClasses = {DiscussRepository.class})
public class ApplicationConfig {

    @Bean
    public MongoTemplate mongoTemplate() throws Exception {
        Mongo mongo = new Mongo("localhost", 27017);
        //UserCredentials userCredentials = new UserCredentials("demo", "demo");
        String databaseName = "demo";
        MongoDbFactory mongoDbFactory = new SimpleMongoDbFactory(mongo, databaseName, null);// userCredentials);
        MongoTemplate mongoTemplate = new MongoTemplate(mongoDbFactory);
        mongoTemplate.setWriteConcern(WriteConcern.SAFE);
        return mongoTemplate;
    }
    
    public static void main(String[] args) {
    	try
    	{
    		new ApplicationConfig().mongoTemplate();
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    	}
	}

}
