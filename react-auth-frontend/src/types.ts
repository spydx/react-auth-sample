export type LoggedIn = {
   token: string,
   tokenType: string, 
   profile: string,
}

export type Events = {
   data: EventData[]
   loading: boolean
   error: Error
}

export type EventData = {
   id: string
   loading: boolean
   name: string
   eventday: string
   generalinfo: string
   contacts?: ContactData[]
   races?: RaceData[]
   location: LocationData
}

export type ContactData = {
   name: string
   email: string
   phone: string
}

export type RaceData = {
   id: number
   distance: number
   startlocation: string
   starttime?: string
   info?: string
   vertical?: boolean
   children?: boolean
   womenonly?: boolean
   relay?: boolean
   multisport?: boolean
   obstaclerun?: boolean
}

export type LocationData = {
   id: number, 
   county: string,
   municipality: string
   place: string
   latitude: string
   longitude: string

}