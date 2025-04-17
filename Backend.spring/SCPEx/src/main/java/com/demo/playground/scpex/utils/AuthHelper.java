package com.demo.playground.scpex.utils;

public class AuthHelper {
    private static final int START = 35;
    private static final int END = 126;
    private static final int PSWD_LENGTH = 16;

    public static String generatePasswd(){ return generatePasswd(PSWD_LENGTH); }
    public static String generatePasswd(int length){
        if(length <= 0) length = PSWD_LENGTH;
        char[] chars = new char[length];

        for(int i = 0; i < length; i++){
            var thisPosition = randomGenerator(i) + START;
            while(thisPosition > END || thisPosition < START){
                if(thisPosition > END) thisPosition = thisPosition / 2;
                else thisPosition = (int)(thisPosition * 1.2);
            }
            if(i > 0 && (int)chars[i] == thisPosition) thisPosition++;
            if(thisPosition > END) thisPosition -= 2;
            chars[i] = (char)thisPosition;
        }
        return new String(chars);
    }

    public static int randomGenerator(int mix){
        return (int)(Math.floor((Math.random() * Math.random() + Math.random() * mix) * 256));
    }
}
