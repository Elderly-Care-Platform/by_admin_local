package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.repository.custom.DiscussRepositoryCustom;

@Repository
public interface DiscussRepository extends MongoRepository<Discuss, String>, DiscussRepositoryCustom {

    public List<Discuss> findAll();
    
   
}
