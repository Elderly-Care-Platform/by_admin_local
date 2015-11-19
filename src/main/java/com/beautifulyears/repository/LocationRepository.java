/**
 * 
 */
package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.beautifulyears.domain.Location;

/**
 * 
 * Repository to make operations on Location collection of mongo
 * 
 * @author Nitin
 *
 */
public interface LocationRepository extends MongoRepository<Location, String> {
	public List<Location> findAll();
	public Location findByPincode(Long pincode);
}
