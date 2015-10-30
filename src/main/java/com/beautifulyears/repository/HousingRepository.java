/**
 * 
 */
package com.beautifulyears.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.repository.custom.HousingRepositoryCustom;

/**
 * @author Nitin
 *
 */
public interface HousingRepository extends
		MongoRepository<HousingFacility, Serializable>, HousingRepositoryCustom {
	public List<HousingFacility> findAll();

	public List<HousingFacility> findByUserId(String userId);

	public HousingFacility findById(String id);
}
