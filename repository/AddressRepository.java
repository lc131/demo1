package com.example.springbootbackend.repository;

import com.example.springbootbackend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByStreetAndCityAndCountry(String street, String city, String country);
}
