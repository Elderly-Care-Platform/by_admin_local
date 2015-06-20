package com.beautifulyears.repository.custom;

import java.util.List;

import com.beautifulyears.domain.Discuss;


public interface DiscussRepositoryCustom  {

	 public List<Discuss> findByDiscussType(String discussType) throws Exception;
}
