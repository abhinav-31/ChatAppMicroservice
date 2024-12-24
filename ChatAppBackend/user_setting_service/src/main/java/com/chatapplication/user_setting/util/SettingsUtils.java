package com.chatapplication.user_setting.util;

import com.chatapplication.user_setting.entity.User;
import com.chatapplication.user_setting.repository.ContactRepository;

import java.util.Map;


public class SettingsUtils {
    // privacy constant
    public static final String EVERYONE = "everyone";
    public static final String NOBODY = "nobody";
    public static final String MY_CONTACTS = "mycontacts";
    public static final String MY_CONTACTS_EXCEPT = "mycontacts_except";


    public static final Map<String, String> DEFAULT_SETTINGS = Map.ofEntries(
            Map.entry("privacy.block_user", "false"),
            Map.entry("privacy.two_step_verification", "false"),
            Map.entry("privacy.phone_number_visibility", EVERYONE),
            Map.entry("privacy.last_seen", EVERYONE),
            Map.entry("privacy.online", EVERYONE),
            Map.entry("privacy.about", EVERYONE),
            Map.entry("privacy.profile_photo", EVERYONE),
            Map.entry("chats.text_size", "5"),
            Map.entry("chats.theme", "light"),
            Map.entry("chats.wallpaper", "default"),
            Map.entry("notifications.private_chat", "true"),
            Map.entry("notifications.group_chat", "true"),
            Map.entry("app_language", "english")
    );

    public static boolean checkVisibilityOfPrivacy(Map<String, String> settings, String settingKey, User requestingUser, User contact, ContactRepository contactRepository) {
        String visibility = settings.get(settingKey);

        // Check if the privacy setting allows visibility for everyone
        if (visibility.equals(SettingsUtils.EVERYONE)) {
            return true;
        }

        // Check if the privacy setting is restricted to nobody
        if (visibility.equals(SettingsUtils.NOBODY)) {
            return false;
        }

        // Check if the privacy setting is for the requesting user's contacts
        if (visibility.equals(SettingsUtils.MY_CONTACTS)) {
            return isUserContactOf(requestingUser, contact, contactRepository);
        }

        // Check if the privacy setting is for everyone except the requesting user's contacts
        if (visibility.equals(SettingsUtils.MY_CONTACTS_EXCEPT)) {
            return !isUserContactOf(requestingUser, contact, contactRepository);
        }

        return false;
    }

    private static boolean isUserContactOf(User requestingUser, User contact, ContactRepository contactRepository) {
        // Check if the contact is in the requesting user's contacts list
        return contactRepository.existsByUserAndContact(requestingUser, contact);
    }
}
