import { getUUID, properCase, randomFromList, randomLat, randomLong } from "../utils";

export const portsService = {

    numMocked: 0,
    cachedWords: undefined,
    MAX_WORDS: 500, //nCr 100C2 = 124750 so thats more than enough words

    async retrievePorts() {
        let ports = {};

        try {
            const response = await fetch('/data/ports.json');
            ports = await response.json();

            Object.keys(ports).forEach(key => {
                ports[key] = {
                    ...ports[key],
                    key,
                    id: getUUID()
                };

            });

        } catch (err) {
            console.error('Failed to retrieve ports =>', err);
            return Promise.reject(err);
        }

        return ports;
    },

    async mockPorts(numPorts = 0) {
        const ports = {},
            words = await portsService.retrieveWords(numPorts);

        for (let i = 0; i < numPorts; i++) {
            const uuid = getUUID(),
                name = `${randomFromList(words)}-${randomFromList(words)}`;

            const port = {
                key: `${name.toUpperCase()}-${Date.now().toString(16)}`,
                id: uuid,
                name: properCase(name),
                coordinates: [
                    randomLong(),
                    randomLat()
                ],
                city: properCase(randomFromList(words)),
                province: properCase(randomFromList(words)),
                country: properCase(randomFromList(words)),
                alias: [],
                regions: [],
                timezone: 'Unknown',
                unlocs: [`PORT-${uuid.toUpperCase()}`]
            };

            ports[port.key] = port;
            portsService.numMocked++;
        }

        return ports;
    },

    async retrieveWords() {
        let words = [];

        if (!portsService.cachedWords) {
            try {
                const response = await fetch('data/words-dictionary.json'),
                    words = Object.keys(await response.json()).slice(0, portsService.MAX_WORDS);

                portsService.cachedWords = words;
            } catch (err) {
                console.error('Failed to retrieve words =>', err);
                return Promise.reject(err);
            }
        } else {
            words = portsService.cachedWords;
        }

        return words;
    }

};
