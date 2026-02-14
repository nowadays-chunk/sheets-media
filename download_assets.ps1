
$products = @{
    "beginner-course.png"     = "https://images.unsplash.com/photo-1485671540120-7f9fc24c6665?w=1000"
    "rock-classics.png"       = "https://images.unsplash.com/photo-1550985543-f47f38aee65e?w=1000"
    "picks-variety.png"       = "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=1000"
    "capo-professional.png"   = "https://images.unsplash.com/photo-1605020422206-303937b4249a?w=1000"
    "metronome-digital.png"   = "https://images.unsplash.com/photo-1556449859-0c8418d27771?w=1000"
    "tuner-clip.png"          = "https://images.unsplash.com/photo-1610444583151-512140a7a58e?w=1000"
    "string-set-premium.png"  = "https://images.unsplash.com/photo-1514320291944-8391b9bd1d88?w=1000"
    "blues-tabs.png"          = "https://images.unsplash.com/photo-1568228105740-42cf43087095?w=1000"
    "flamenco-techniques.png" = "https://images.unsplash.com/photo-1533159577354-391605cfbab0?w=1000"
    "slide-glass.png"         = "https://images.unsplash.com/photo-1466428996289-fb355a3997a9?w=1000"
    "theory-masterclass.png"  = "https://images.unsplash.com/photo-1507838596008-22c673b390ac?w=1000"
    "metal-tabs.png"          = "https://images.unsplash.com/photo-1615678815958-3110a220ad33?w=1000"
}

$articles = @{
    "composition.jpg"      = "https://images.unsplash.com/photo-1516280440614-37939bb91d8b?w=1000"
    "stats.jpg"            = "https://images.unsplash.com/photo-1551288049-bbbda536639a?w=1000"
    "theory.jpg"           = "https://images.unsplash.com/photo-1507838596008-22c673b390ac?w=1000"
    "getting-started.jpg"  = "https://images.unsplash.com/photo-1485671540120-7f9fc24c6665?w=1000"
    "rhythm.jpg"           = "https://images.unsplash.com/photo-1556449859-0c8418d27771?w=1000"
    "practice.jpg"         = "https://images.unsplash.com/photo-1516280440614-37939bb91d8b?w=1000"
    "harmony.jpg"          = "https://images.unsplash.com/photo-1507838596008-22c673b390ac?w=1000"
    "tone.jpg"             = "https://images.unsplash.com/photo-1564186763535-ebb21ef04667?w=1000"
    "ear-training.jpg"     = "https://images.unsplash.com/photo-1466428996289-fb355a3997a9?w=1000"
    "delta-blues.jpg"      = "https://images.unsplash.com/photo-1568228105740-42cf43087095?w=1000"
    "flamenco.jpg"         = "https://images.unsplash.com/photo-1533159577354-391605cfbab0?w=1000"
    "guitar-evolution.jpg" = "https://images.unsplash.com/photo-1550985533-049870870ac?w=1000"
}

$products.GetEnumerator() | ForEach-Object {
    Write-Host "Downloading $($_.Key)..."
    try {
        Invoke-WebRequest -Uri $_.Value -OutFile "public\assets\products\$($_.Key)" -ErrorAction Stop
    }
    catch {
        Write-Warning "Failed to download $($_.Key): $($_.Exception.Message)"
    }
}

$articles.GetEnumerator() | ForEach-Object {
    Write-Host "Downloading $($_.Key)..."
    try {
        Invoke-WebRequest -Uri $_.Value -OutFile "public\images\about\$($_.Key)" -ErrorAction Stop
    }
    catch {
        Write-Warning "Failed to download $($_.Key): $($_.Exception.Message)"
    }
}
