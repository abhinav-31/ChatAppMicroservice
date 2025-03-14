package com.chatapplication.user_setting.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactAddReqDTO {
    private String contactPhoneNumber;
    private String contactName;
}
