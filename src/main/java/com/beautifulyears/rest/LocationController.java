/**
 * 
 */
package com.beautifulyears.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Location;
import com.beautifulyears.repository.LocationRepository;

/**
 * 
 * Class used to implement the APIs for autocompletion of address
 * and to suggest address related fields
 * @author Nitin
 *
 */
@Controller
@RequestMapping("/location")
public class LocationController {
	private LocationRepository locationRepository;
	
	@Autowired
	public LocationController(LocationRepository locationRepository) {
		this.locationRepository = locationRepository;
	}
	
	@RequestMapping(method = { RequestMethod.GET }, value = { "/getLocationByPincode" }, produces = { "application/json" })
	@ResponseBody
	public Object getLocationByPinCode(@RequestParam(value = "pincode", required = true) Long pincode){
		Location location = null;
		location = locationRepository.findByPincode(pincode);
		return location;
	}
	
	
}
