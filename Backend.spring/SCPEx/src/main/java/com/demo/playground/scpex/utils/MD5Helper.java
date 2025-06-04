package com.demo.playground.scpex.utils;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class MD5Helper implements PasswordEncoder {
    public static final String PREFIX = "{gabxd}";

    private static final String SALT = "#ZgW5gC6$^r#Q%L7%y";

    public static String encrypt(String content) {

        if(content.startsWith(PREFIX)) return (PREFIX + DigestUtils.md2Hex(SALT + content.replace(PREFIX,  "")));
        else return (PREFIX + DigestUtils.md5Hex(SALT + content));
    }

    public static boolean verify(String content, String md5) {
        return md5.equalsIgnoreCase(encrypt(content));
        }

    @Override
    public String encode(CharSequence rawPassword) {
        return encrypt(rawPassword.toString());
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        System.out.println(rawPassword + " ENCODED AS: " + encodedPassword);

        // todo if correct passwd cannot be verified correctly then come back remove the prefix
//        int times = encodedPassword.split(PREFIX).length - 1;
//        var realEncodedPassword = encodedPassword.substring(PREFIX.length() * times);
//        System.out.println(realEncodedPassword);
        System.out.println("REAL ENCODE: " + encrypt(rawPassword.toString()));
        boolean isPassed = verify(rawPassword.toString(), PREFIX + encodedPassword);
        System.out.println("isPassed: " + isPassed);
        return isPassed;
    }
}
