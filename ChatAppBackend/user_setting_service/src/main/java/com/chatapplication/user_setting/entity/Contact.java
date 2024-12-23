package com.chatapplication.user_setting.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contact extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")// Many contact has One User
    private User user;

    @ManyToOne
    @JoinColumn(name="contact_id", nullable=false)
    private User contact;
}
