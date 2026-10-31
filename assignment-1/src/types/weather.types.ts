export interface WeatherResponse{
    weather:{
        main:string
        description:string
    }[]
    main:{
        temp:number
    }
    name:string
}