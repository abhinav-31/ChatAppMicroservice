package com.chatapplication.user_setting.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Map;


@Builder
@Entity
@Table(name = "settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Settings extends BaseEntity{

    @OneToOne(mappedBy="settings")
    private User user;

    @ElementCollection
    @CollectionTable(name="user_settings",joinColumns=@JoinColumn(name="settings_id"))
    @MapKeyColumn(name="setting_key")
    @Column(name="setting_value")
    private Map<String,String> settingsMap;

}
