const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const { transformSync } = require("@babel/core");

// Executa o SQL real com SQLite do Node. Apenas as pontes nativas são substituídas.
function createEnvironment(databasePath = ":memory:", secureValues = new Map(), preferences = new Map()) {
    const db = new DatabaseSync(databasePath);
    const failures = {};
    const sqlite = {
        async openDatabaseAsync() {
            if (failures.open) throw new Error("Falha de abertura simulada");
            return {
                async execAsync(sql) { db.exec(sql); },
                async runAsync(sql, ...params) {
                    const result = db.prepare(sql).run(...params);
                    return { lastInsertRowId: Number(result.lastInsertRowid), changes: Number(result.changes) };
                },
                async getAllAsync(sql, ...params) {
                    if (failures.query) throw new Error("Falha de leitura simulada");
                    return db.prepare(sql).all(...params);
                },
                async getFirstAsync(sql, ...params) {
                    if (failures.query) throw new Error("Falha de leitura simulada");
                    return db.prepare(sql).get(...params) || null;
                },
            };
        },
    };
    const secureStore = {
        async setItemAsync(key, value) {
            if (failures.secureWrite) throw new Error("Falha no SecureStore");
            secureValues.set(key, value);
        },
        async getItemAsync(key) {
            if (failures.secureRead) throw new Error("Falha no SecureStore");
            return secureValues.get(key) ?? null;
        },
        async deleteItemAsync(key) {
            if (failures.secureDelete) throw new Error("Falha no SecureStore");
            secureValues.delete(key);
        },
    };
    const asyncStorage = {
        async getItem(key) {
            if (failures.preferencesRead) throw new Error("Falha no AsyncStorage");
            return preferences.get(key) ?? null;
        },
        async setItem(key, value) {
            if (failures.preferencesWrite) throw new Error("Falha no AsyncStorage");
            preferences.set(key, value);
        },
    };
    const nativeModules = {
        "expo-sqlite": sqlite,
        "expo-secure-store": secureStore,
        "@react-native-async-storage/async-storage": asyncStorage,
    };
    const cache = new Map();
    function load(relativePath) {
        const filename = path.resolve(__dirname, "..", relativePath);
        if (cache.has(filename)) return cache.get(filename).exports;
        const module = { exports: {} };
        cache.set(filename, module);
        const { code } = transformSync(fs.readFileSync(filename, "utf8"), {
            filename, configFile: false, babelrc: false,
            plugins: ["@babel/plugin-transform-modules-commonjs"],
        });
        function localRequire(specifier) {
            if (Object.hasOwn(nativeModules, specifier)) return nativeModules[specifier];
            if (specifier.startsWith(".")) return load(path.resolve(path.dirname(filename), specifier));
            return require(specifier);
        }
        new Function("require", "module", "exports", code)(localRequire, module, module.exports);
        return module.exports;
    }
    return { db, load, failures, secureValues, preferences };
}

module.exports = { createEnvironment };
