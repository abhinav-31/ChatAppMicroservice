package com.chatapplication.user_setting.service.impl;

import com.chatapplication.user_setting.dto.ContactAddReqDTO;
import com.chatapplication.user_setting.dto.ContactResponseDTO;
import com.chatapplication.user_setting.entity.Contact;
import com.chatapplication.user_setting.entity.User;
import com.chatapplication.user_setting.exception.ResourceNotFoundException;
import com.chatapplication.user_setting.repository.ContactRepository;
import com.chatapplication.user_setting.repository.UserRepository;
import com.chatapplication.user_setting.service.interfaces.IContactService;
import com.chatapplication.user_setting.service.interfaces.ISettingsService;
import com.chatapplication.user_setting.util.SettingsUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Slf4j
@Service
@Transactional
public class ContactServiceImpl implements IContactService {
    @Autowired
    ContactRepository contactRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ISettingsService settingsService;

    @Override
    public List<ContactResponseDTO> getContacts() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // fetch all contacts
        List<Contact> contacts = contactRepository.findByUser(user).orElseThrow(() -> new ResourceNotFoundException("User contact not found"));
        List<ContactResponseDTO> contactList = new ArrayList<>();

        List<ContactResponseDTO> list = contacts.stream().map(contact -> this.contactResponseDTOBuilder(contact, user)).toList();
        System.out.println("Contacts list: " + list);
        return list;
    }

    @Override
    public ContactResponseDTO addContact(ContactAddReqDTO contactAddReqDTO) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        System.out.println("Contact Phone Number : " + contactAddReqDTO.getContactPhoneNumber());
        User contact = userRepository.findByPhoneNumber(contactAddReqDTO.getContactPhoneNumber()).orElseThrow(() -> new ResourceNotFoundException("Contact is not present in the system"));

        // check contact already added for the user
        if (contactRepository.existsByUserAndContact(user, contact)) {
            log.error("Contact {} already added", contact);
            throw new IllegalArgumentException("Contact already added");
        }
        // add contact
        Contact newContact = Contact.builder()
                .contactName(contactAddReqDTO.getContactName())
                .user(user)
                .contact(contact)
                .build();
        contactRepository.save(newContact);
        log.info("Contact with contactId: {} added to the User with userId: {}", contact.getId(), user.getId());
        return this.contactResponseDTOBuilder(newContact, user);
    }

    public ContactResponseDTO contactResponseDTOBuilder(Contact contact, User user) {
        Map<String, String> contactSettings = settingsService.getUserSettings(contact.getContact().getId());
        return ContactResponseDTO.builder()
                .contactName(contact.getContactName())
                .phoneNumber(SettingsUtils.checkVisibilityOfPrivacy(contactSettings, "privacy.phone_number_visibility", user, contact.getContact(), contactRepository)
                        ? contact.getContact().getPhoneNumber() : null)
                .about(SettingsUtils.checkVisibilityOfPrivacy(contactSettings, "privacy.about", user, contact.getContact(), contactRepository)
                        ? contact.getContact().getAbout() : null)
                .contactProfilePhoto(SettingsUtils.checkVisibilityOfPrivacy(contactSettings, "privacy.profile_photo", user, contact.getContact(), contactRepository)
                        ? contact.getContact().getProfilePhoto() : null)
                .receiverId(contact.getContact().getUserId())
                .build();
    }
}