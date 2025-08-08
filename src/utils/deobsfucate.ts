export class MegacloudExtractor {
    private readonly DEFAULT_CHARSET = Array.from({ length: 95 }, (_, i) =>
        String.fromCharCode(i + 32)
    );

    private deriveKey(secret: string, nonce: string): string {
        const input = secret + nonce;
        let hash = 0n;

        for (let i = 0; i < input.length; i++) {
            hash =
                BigInt(input.charCodeAt(i)) + hash * 31n + (hash << 7n) - hash;
        }

        const modHash = hash % 0x7fffffffffffffffn;

        const xorProcessed = [...input]
            .map((char) => String.fromCharCode(char.charCodeAt(0) ^ 247))
            .join("");

        const shift = (Number(modHash) % xorProcessed.length) + 5;
        const rotated =
            xorProcessed.slice(shift) + xorProcessed.slice(0, shift);

        const reversedNonce = [...nonce].reverse().join("");

        let interleaved = "";
        const maxLen = Math.max(rotated.length, reversedNonce.length);
        for (let i = 0; i < maxLen; i++) {
            interleaved += (rotated[i] || "") + (reversedNonce[i] || "");
        }

        const len = 96 + (Number(modHash) % 33);
        const sliced = interleaved.substring(0, len);

        return [...sliced]
            .map((ch) => String.fromCharCode((ch.charCodeAt(0) % 95) + 32))
            .join("");
    }

    private columnarTranspositionCipher(text: string, key: string): string {
        const cols = key.length;
        const rows = Math.ceil(text.length / cols);

        const grid = Array.from({ length: rows }, () => Array(cols).fill(""));
        const columnOrder = [...key]
            .map((char, idx) => ({ char, idx }))
            .sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));

        let i = 0;
        for (const { idx } of columnOrder) {
            for (let row = 0; row < rows; row++) {
                grid[row][idx] = text[i++] || "";
            }
        }

        return grid.flat().join("");
    }

    private deterministicUnshuffle(charset: string[], key: string): string[] {
        let seed = [...key].reduce(
            (acc, char) =>
                (acc * 31n + BigInt(char.charCodeAt(0))) & 0xffffffffn,
            0n
        );

        const random = (limit: number): number => {
            seed = (seed * 1103515245n + 12345n) & 0x7fffffffn;
            return Number(seed % BigInt(limit));
        };

        const result = [...charset];
        for (let i = result.length - 1; i > 0; i--) {
            const j = random(i + 1);
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    }

    public deobsfucate(
        secret: string,
        nonce: string,
        encrypted: string,
        rounds = 3
    ): string {
        let data = Buffer.from(encrypted, "base64").toString("utf-8");
        const keyphrase = this.deriveKey(secret, nonce);

        for (let round = rounds; round >= 1; round--) {
            const passphrase = keyphrase + round;

            let seed = [...passphrase].reduce(
                (acc, char) =>
                    (acc * 31n + BigInt(char.charCodeAt(0))) & 0xffffffffn,
                0n
            );
            const random = (limit: number): number => {
                seed = (seed * 1103515245n + 12345n) & 0x7fffffffn;
                return Number(seed % BigInt(limit));
            };

            data = [...data]
                .map((char) => {
                    const idx = this.DEFAULT_CHARSET.indexOf(char);
                    if (idx === -1) return char;
                    const offset = random(95);
                    return this.DEFAULT_CHARSET[(idx - offset + 95) % 95];
                })
                .join("");

            data = this.columnarTranspositionCipher(data, passphrase);

            const shuffled = this.deterministicUnshuffle(
                this.DEFAULT_CHARSET,
                passphrase
            );
            const mapping: Record<string, string> = {};
            shuffled.forEach((c, i) => (mapping[c] = this.DEFAULT_CHARSET[i]));
            data = [...data].map((char) => mapping[char] || char).join("");
        }
        const lengthStr = data.slice(0, 4);
        let length = parseInt(lengthStr, 10);
        if (isNaN(length) || length <= 0 || length > data.length - 4) {
            console.error("Invalid length in decrypted string");
            return data;
        }
        return data.slice(4, 4 + length);
    }
}
