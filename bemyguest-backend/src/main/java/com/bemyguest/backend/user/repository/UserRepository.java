package com.bemyguest.backend.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bemyguest.backend.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
