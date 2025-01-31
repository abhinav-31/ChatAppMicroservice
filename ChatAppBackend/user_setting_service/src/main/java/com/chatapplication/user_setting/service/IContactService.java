package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.ApiResponse;
import com.chatapplication.user_setting.dto.ContactResponseDTO;

import java.util.List;

public interface IContactService {
    List<ContactResponseDTO> getContacts(Long userId);
    ApiResponse addContact(Long userId, Long contactId);
}
