/*
// Cryptographic Hashes

1) skriver password
2) password kommer gennem hash function
3) hased string/digest kommer ud - altid unik
4) digestet sammenlignes med de digests der findes i en password store
5) matcher de? Ja, access granted. Nej, access denied

// Dictionary Attacks - teknik til at finde decryption key, ved at prøve tusindevis af most likely keys

    - Hackers kan decrypte en digest, derfor SALT
    - Salting er et ekstra random hash, som tilføjes til digestet 
    - Oprettelse af password: plain text password --> salt+hashedString/digest
    - Verificering af password: matcher det stored salt med den hashede string?


*/