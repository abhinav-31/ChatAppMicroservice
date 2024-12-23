package com.chatapplication.user_setting.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity{

    @Column(unique = true,nullable = false, length = 20)
    private String email;

    @Column(unique = true, nullable = false, length = 13)
    private String phoneNumber;
    @Column(nullable = false, length = 10)
    private String username;
    @Column
    private String about;
    @Column
    private String profilePhoto;
    @Column
    private LocalDateTime lastSeen; // TimeStamp for the last time the user was active
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "settings_id",referencedColumnName = "id")
    private Settings settings;
}
