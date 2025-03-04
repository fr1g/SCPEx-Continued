package com.demo.playground.scpex.utils;
import org.apache.commons.codec.digest.DigestUtils;

public class MD5Helper {

        private static final String SALT = "#ZgW5gC6$^r#Q%L7%y";

        public static String encrypt(String content) {
            return DigestUtils.md2Hex(SALT + content);
        }

        public static boolean verify(String content, String md5) {
            return md5.equalsIgnoreCase(encrypt(content));
        }

}
