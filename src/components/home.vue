<template>
    <v-container>
        <v-row>
            <h1>Home</h1>
        </v-row>

        <v-row style="margin-top: 34px;">
            <v-divider></v-divider>
        </v-row>

        <v-row style="margin-top: 30px;">
            <p>Start a new project form a JSON:</p>
        </v-row>

        <!-- <v-row style="margin-top: 15px;">
            <u @click="openDialog()">Upload a JSON</u>
        </v-row>

        <v-row style="margin-top: 30px;">
            <v-divider></v-divider>
        </v-row>

        <v-row style="margin-top: 30px;">
            <p>Recent project:</p>
        </v-row>

        <v-row></v-row> -->
        <v-row style="margin-top: 30px;">
            <v-file-input v-model="files" label="Choose a JSON file" accept=".json" @change="uploadFile"></v-file-input>
        </v-row>

        <v-row v-if="uploaded">
            <v-col>Country: {{ Object.keys(infoData.data).length }} rows</v-col>
            <v-col></v-col>
        </v-row>

        <v-row v-if="uploaded">
            <v-col>Prop: '{{ infoData.prop }}'</v-col>
            <v-col>
                <v-select label="prop data type" v-model="infoData.datatype"
                          :items="['categorical', 'quantitative']"></v-select>
            </v-col>


        </v-row>

        <v-row v-if="uploaded" style="margin-bottom: 12px;">
            <v-divider></v-divider>
        </v-row>


        <v-row>
            <v-btn color="primary" @click="createInstance" :disabled="!uploaded">Create</v-btn>
            <v-btn @click="clear" style="margin-left: 16px;">CLEAR</v-btn>
        </v-row>

        <h2 class="example" style="margin-top: 30px;">Example Data Files</h2>
        <v-row>
    <v-col class="download" style="margin-top: 15px;"><a href="https://raw.githubusercontent.com/MapCraftForGeo-InfoGraphics/geo-infographics/master/public/country-by-population-description.json" download style="text-decoration: none;"><span style="background-color: pink; padding: 10px; padding-left: 25px; padding-right: 25px;color: #000; text-decoration: none; border-radius: 10px;">Download Quantitative Sample File</span></a></v-col>
</v-row>

<v-row>
    <v-col class="download" style="margin-top: 15px;"><a href="https://raw.githubusercontent.com/MapCraftForGeo-InfoGraphics/geo-infographics/master/public/country-by-flag-description.json" download style="text-decoration: none;"><span style="background-color: pink; padding: 10px; padding-left: 25px; padding-right: 25px;color: #000; text-decoration: none; border-radius: 10px;">Download Categorical Sample File</span></a></v-col>
</v-row>
    </v-container>

    <!-- <v-dialog v-model="dialog" max-width="500px">
        <template>
            <u @click="openDialog" style="cursor: pointer;">Upload a JSON</u>
        </template>
<v-card>
    <v-card-title>Upload JSON Files</v-card-title>
    <v-card-text>
        <v-file-input v-model="files" label="Choose a JSON file" accept=".json" @change="uploadFile"></v-file-input>

    </v-card-text>
    <v-card-actions>
        <v-btn color="primary" @click="createInstance" :disabled="!uploaded">Create</v-btn>
        <v-btn @click="dialog = false">Close</v-btn>
    </v-card-actions>
</v-card>
</v-dialog> -->
</template>

<script>
import * as d3 from 'd3';
import {inject} from 'vue';

export default {
    name: 'homeTab',

    data() {
        return {
            files: [],
            infoData: {},

            uploaded: false,
        };
    },
    methods: {
        clear() {
            this.files = [];
            this.infoData = {};
            this.targetKey = 'NaN'
            this.uploaded = false;
        },

//        readFile(file) {
//            return new Promise((resolve, reject) => {
//                const reader = new FileReader();
//                reader.onload = function (e) {
//                    const fileContents = e.target.result;
//                    d3.json(fileContents)
//                        .then(data => {
//                            const keys = Object.keys(data[0]);
//                            const targetKey = keys.find(key => key !== 'country');
//
//                            const infoData = data.reduce((acc, cur) => {
//                                acc[cur['country']] = cur[targetKey];
//                                return acc;
//                            }, {});
//                            const result = {
//                                "name": file.name,
//                                "prop": targetKey,
//                                "datatype": isNaN(Object.values(data[0])[1]) ? 'categorical' : 'quantitative',
//                                "data": infoData
//                            };
//
//                            resolve(result);
//                        })
//                        .catch(error => {
//                            console.error(error);
//                            reject(error);
//                        });
//                };
//                reader.readAsDataURL(file);
//            });
//        },

        readFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const fileContents = e.target.result;
                    d3.json(fileContents)
                        .then(data => {
                            const infoData = data.reduce((acc, cur) => {
                                // 复制当前对象，但排除 'country' 键
                                const {country, ...rest} = cur;
                                // 使用 'country' 作为键，其余键值对作为值
                                acc[cur['country']] = rest;
                                return acc;
                            }, {});
                            const result = {
                                "name": file.name,
                                "prop": Object.keys(data[0])[1],
                                "datatype": isNaN(Object.values(data[0])[1]) ? 'categorical' : 'quantitative',
                                "data": infoData
                            };

                            resolve(result);
                        })
                        .catch(error => {
                            console.error(error);
                            reject(error);
                        });
                };
                reader.readAsDataURL(file);
            });
        },

        uploadFile() {
            if (this.files.length === 0) {
                console.log("No files to upload.");
                return;
            }

            const file = this.files[0]; // 获取第一个文件

            this.readFile(file)
                .then(result => {
                    this.infoData = result;
                    this.uploaded = true;
                    console.log(this.infoData);
                })
                .catch(error => {
                    this.uploaded = false;
                    console.error(error);
                });
        },

        createInstance() {
            this.loadInfoData(this.infoData);
        }
    },

    setup() {
        const loadInfoData = inject('loadInfoData');

        return {loadInfoData};
    }
}
</script>

<style scoped>
h1 {
    font-size: 56px;
}

.example {
    margin-top:50px;
}
</style>