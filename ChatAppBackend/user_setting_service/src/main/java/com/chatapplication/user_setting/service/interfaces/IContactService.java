package com.chatapplication.user_setting.service.interfaces;

import com.chatapplication.user_setting.dto.ContactAddReqDTO;
import com.chatapplication.user_setting.dto.ContactResponseDTO;

import java.util.List;

public interface IContactService {
    List<ContactResponseDTO> getContacts();

    ContactResponseDTO addContact(ContactAddReqDTO contactAddReqDTO);
}
