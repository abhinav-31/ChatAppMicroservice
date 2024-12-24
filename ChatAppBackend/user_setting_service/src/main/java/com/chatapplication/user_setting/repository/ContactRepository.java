package com.chatapplication.user_setting.repository;

import com.chatapplication.user_setting.entity.Contact;
import com.chatapplication.user_setting.entity.User;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact,Long> {
    @Query("select c.contact from Contact c where c.user.id=:userId")
    List<User> findContactsByUserId(Long userId);

    boolean existsByUserAndContact(User user, User contact);
}
