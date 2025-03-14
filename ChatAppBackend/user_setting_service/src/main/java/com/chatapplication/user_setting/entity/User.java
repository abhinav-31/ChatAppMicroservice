package com.chatapplication.user_setting.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Builder
@Entity
@Table(name = "users")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {
    @UuidGenerator(style = UuidGenerator.Style.RANDOM)
    @Column(length = 37)
    private String userId;

    @Column(unique = true, nullable = false, length = 50)
    private String email;

    @Column(unique = true, nullable = false, length = 13)
    private String phoneNumber;
    @Column(nullable = false, length = 20)
    private String username;
    @Column
    private String about;
    @Column
    private String profilePhoto;
    @Column
    private LocalDateTime lastSeen;                                // TimeStamp for the last time the user was active
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // Bi-direction, child side of association, owning foreign key
    @JoinColumn(name = "settings_id", referencedColumnName = "id")
    @JsonIgnore
    private Settings settings;
}
