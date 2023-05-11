import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Program, Talent, Trainer } from 'src/assets/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataExtractService {

  constructor() { }

  /**
   * Extracting program names from nested data for filtering
   * @param {Talent} data 
   * @returns {[Talent[], SelectItem[]]}
   */
  public extractProgramNamesForFilter(data: Talent[]): [Talent[], SelectItem[]] {
    var possibleProgramsList: SelectItem[] = [];
    for (var i in data) {
      var enrolledProgramsNames: string[] = [];
      for (var j = 0; j < data[i].enrolledPrograms!?.length; j++) {
        if (possibleProgramsList.length == 0)
          possibleProgramsList.push({
            value: data[i].enrolledPrograms![j].id,
            label: data[i].enrolledPrograms![j].name
          })
        else {
          var foundFlag = false;
          for (var k in possibleProgramsList) {
            console.log(possibleProgramsList[k]);
            if (possibleProgramsList[k].value == data[i].enrolledPrograms![j].id) {
              foundFlag = true;
              break;
            }
          }
          if (!foundFlag) possibleProgramsList.push({
            value: data[i].enrolledPrograms![j].id,
            label: data[i].enrolledPrograms![j].name
          })
        }
        enrolledProgramsNames.push(data[i].enrolledPrograms![j].name)
      }
      data[i].enrolledProgramNames = enrolledProgramsNames;
    }
    return [data, possibleProgramsList];
  }

  /**
   * 
   * @param {Program[]} data 
   * @returns {[Program[], SelectItem[]]}
   */
  public extractTrainerNamesForFilter(data: Program[]): [Program[], SelectItem[]] {
    var possibleTrainersList: SelectItem[] = [];
    for (var i in data) {
      var trainersNames: string[] = [];
      for (var j = 0; j < data[i].trainers!?.length; j++) {
        if (possibleTrainersList.length == 0)
          possibleTrainersList.push({
            value: data[i].trainers![j].id,
            label: data[i].trainers![j].name
          })
        else {
          var foundFlag = false;
          for (var k in possibleTrainersList) {
            // console.log(possibleTrainersList[k]);
            if (possibleTrainersList[k].value == data[i].trainers![j].id) {
              foundFlag = true;
              break;
            }
          }
          if (!foundFlag) possibleTrainersList.push({
            value: data[i].trainers![j].id,
            label: data[i].trainers![j].name
          })
        }
        trainersNames.push(data[i].trainers![j].name)
      }
      data[i].trainerNames = trainersNames;
    }
    return [data, possibleTrainersList];
  }

  /**
   * Extracting all trainers fro dropdown
   * @param {Trainer[]} data 
   * @returns {SelectItem[]}
   */
  public exractAllTrainers(data: Trainer[]): SelectItem[] {
    var trainersList: SelectItem[] = [];
    for(var i in data) {
      trainersList.push({
        label: data[i].name,
        value: data[i].id
      })
    }
    return trainersList;
  }
}
