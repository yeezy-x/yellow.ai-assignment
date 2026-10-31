export interface WeatherResponse{
    weather:{
        id:number
        main:string
        description:string
    }[]
    main:{
        temp:number
    }
    name:string
}