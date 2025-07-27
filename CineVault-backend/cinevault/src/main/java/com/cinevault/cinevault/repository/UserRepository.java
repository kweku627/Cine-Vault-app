package com.cinevault.cinevault.repository;

import com.cinevault.cinevault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Additional query methods can be defined here
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
} 