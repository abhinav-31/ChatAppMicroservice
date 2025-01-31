package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.ApiResponse;
import com.chatapplication.user_setting.dto.ContactResponseDTO;
import com.chatapplication.user_setting.entity.Contact;
import com.chatapplication.user_setting.entity.User;
import com.chatapplication.user_setting.exception.ResourceNotFoundException;
import com.chatapplication.user_setting.repository.ContactRepository;
import com.chatapplication.user_setting.repository.UserRepository;
import com.chatapplication.user_setting.util.SettingsUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Slf4j
@Service
@Transactional
public class ContactServiceImpl implements IContactService{
    @Autowired
    ContactRepository contactRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ISettingsService settingsService;

    @Override
    public List<ContactResponseDTO> getContacts(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User with given id: "+userId+" not found"));
        // fetch all contacts
        List<User> contacts = contactRepository.findContactsByUserId(userId);
        List<ContactResponseDTO> contactList = new ArrayList<>();
        /*for(User contact : contacts){
            // fetch the settings
            Map<String, String> contactSettings = settingsService.getUserSettings(contact.getId());
            ContactResponseDTO contactDto = new ContactResponseDTO();
            contactDto.setUsername(contact.getUsername());
            // Check if the phone number is visible to the user
            if (SettingsUtils.checkVisibilityOfPrivacy(contactSettings, "privacy.phone_number_visibility", user, contact, contactRepository)) {
                contactDto.setPhoneNumber(contact.getPhoneNumber());
            } else {
                contactDto.setPhoneNumber(null);
            }

            // Check if the about field is visible to the user
            if (SettingsUtils.checkVisibilityOfPrivacy(contactSettings, "privacy.about", user, contact, contactRepository)) {
                contactDto.setAbout(contact.getAbout());
            } else {
                contactDto.setAbout(null);
            }

            // Check if the profile photo is visible to the user
            if (SettingsUtils.checkVisibilityOfPrivacy(contactSettings, "privacy.profile_photo", user, contact, contactRepository)) {
                contactDto.setProfilePicture(contact.getProfilePhoto());
            } else {
                contactDto.setProfilePicture(null);
            }

            contactList.add(contactDto);
        }*/
       return contacts.stream().map(contact -> {
           Map<String, String> contactSettings = settingsService.getUserSettings(contact.getId());
           return ContactResponseDTO.builder()
                   .username(contact.getUsername())
                   .phoneNumber(SettingsUtils.checkVisibilityOfPrivacy(contactSettings,"privacy.phone_number_visibility",user,contact,contactRepository)
                           ?contact.getPhoneNumber():null)
                   .about(SettingsUtils.checkVisibilityOfPrivacy(contactSettings,"privacy.about",user,contact,contactRepository)
                           ?contact.getAbout():null)
                   .profilePhoto(SettingsUtils.checkVisibilityOfPrivacy(contactSettings,"privacy.profile_photo",user,contact,contactRepository)
                           ?contact.getProfilePhoto():null)
                   .build();
       }).toList();
    }

    @Override
    public ApiResponse addContact(Long userId, Long contactId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User with given id: "+userId+" not found"));
        User contact = userRepository.findById(contactId).orElseThrow(()-> new ResourceNotFoundException("Contact with given id: "+contactId+" not found"));

        // check contact already added for the user
        if(contactRepository.existsByUserAndContact(user,contact)){
            log.error("Contact {} already added", contact);
            throw new IllegalArgumentException("Contact already added");
        }
        // add contact
        Contact newContact = Contact.builder()
                .user(user)
                .contact(contact)
                .build();
        contactRepository.save(newContact);
        log.info("Contact with contactId: {} added to the User with userId: {}", contactId, user);
        return new ApiResponse("Contact with contactId: "+contactId+" added to the User with userId: "+userId,true);
    }
}
