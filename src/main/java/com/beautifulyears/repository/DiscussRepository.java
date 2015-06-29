package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.Discuss;

@Repository
public interface DiscussRepository extends MongoRepository<Discuss, String> {

    public List<Discuss> findAll();
    
   
}
