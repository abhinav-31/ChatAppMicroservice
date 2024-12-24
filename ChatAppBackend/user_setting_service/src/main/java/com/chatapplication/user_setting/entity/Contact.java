package com.chatapplication.user_setting.entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Table(name="contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contact extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")       // Many contact has One User
    private User user;                  // Owner who owns the contact relationship

    @ManyToOne
    @JoinColumn(name="contact_id", nullable=false)
    private User contact;               // Persons the owner connected to
}
