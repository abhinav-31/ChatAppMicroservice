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

    @OneToOne(mappedBy="settings")                 // Bi-direction, parent side of association
    private User user;

    @ElementCollection                             // Indicates this field is not an entity itself but a collection of elements stored in a separate table.
    @CollectionTable(name="user_settings",joinColumns=@JoinColumn(name="settings_id")) // configures the join table used to store the collection
    @MapKeyColumn(name="setting_key")              // column that store keys of the map
    @Column(name="setting_value")                  // column that store values of the map
    private Map<String,String> settingsMap;        // A map of user settings where keys are setting names and values are their corresponding values.

}
