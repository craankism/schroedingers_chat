package sc.backend.components;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CryptoUtilTest {

    private CryptoUtil cryptoUtil;

    @BeforeEach
    void setUp() {
        cryptoUtil = new CryptoUtil(
                "test-master-key-at-least-32-characters-long!!"
        );
    }

    @Test
    void encryptThenDecrypt_returnsOriginalPlaintext() {
        byte[] original = "Hallo Schroedingers Chat!".getBytes();

        CryptoUtil.EncryptionResult result = cryptoUtil.encrypt(original);
        byte[] decrypted = cryptoUtil.decrypt(result.ciphertext(), result.iv());

        assertArrayEquals(original, decrypted);
    }

    @Test
    void encryptThenDecrypt_worksForBinaryData() {
        byte[] original = new byte[]{0, 1, 2, 3, -128, 127, 0};

        CryptoUtil.EncryptionResult result = cryptoUtil.encrypt(original);
        byte[] decrypted = cryptoUtil.decrypt(result.ciphertext(), result.iv());

        assertArrayEquals(original, decrypted);
    }

    @Test
    void encryptThenDecrypt_worksForEmptyInput() {
        byte[] original = new byte[0];

        CryptoUtil.EncryptionResult result = cryptoUtil.encrypt(original);
        byte[] decrypted = cryptoUtil.decrypt(result.ciphertext(), result.iv());

        assertArrayEquals(original, decrypted);
    }

    @Test
    void encrypt_sameInputProducesDifferentCiphertext() {
        byte[] plaintext = "Selbe Datei, zweimal verschluesselt".getBytes();

        CryptoUtil.EncryptionResult result1 = cryptoUtil.encrypt(plaintext);
        CryptoUtil.EncryptionResult result2 = cryptoUtil.encrypt(plaintext);

        assertFalse(
                java.util.Arrays.equals(result1.ciphertext(), result2.ciphertext()),
                "Zwei Verschluesselungen desselben Plaintext sollten unterschiedlichen Ciphertext ergeben"
        );
        assertFalse(
                java.util.Arrays.equals(result1.iv(), result2.iv()),
                "Zwei Verschluesselungen sollten unterschiedliche IVs haben"
        );
    }

    @Test
    void decrypt_withWrongIv_throwsException() {
        byte[] original = "Geheime Nachricht".getBytes();
        CryptoUtil.EncryptionResult result = cryptoUtil.encrypt(original);

        byte[] wrongIv = cryptoUtil.generateIV();

        assertThrows(RuntimeException.class, () ->
                cryptoUtil.decrypt(result.ciphertext(), wrongIv)
        );
    }

    @Test
    void generateIV_producesUniqueValues() {
        byte[] iv1 = cryptoUtil.generateIV();
        byte[] iv2 = cryptoUtil.generateIV();

        assertEquals(12, iv1.length);
        assertEquals(12, iv2.length);
        assertFalse(java.util.Arrays.equals(iv1, iv2));
    }
}